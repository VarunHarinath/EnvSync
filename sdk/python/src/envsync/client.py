import json,time
from urllib.error import HTTPError,URLError
from urllib.request import Request,urlopen
class EnvSyncError(Exception): pass
class AuthenticationError(EnvSyncError): pass
class PermissionError(EnvSyncError): pass
class SecretNotFoundError(EnvSyncError): pass
class NetworkError(EnvSyncError): pass
class ServerError(EnvSyncError): pass
class EnvSync:
    def __init__(self,api_key:str,base_url:str,environment_id:str|None=None,timeout:float=10,cache_ttl:float=0,opener=urlopen):
        if not api_key.startswith(("es_live_","ea_live_")): raise ValueError("A valid EnvSync api_key is required")
        if not base_url: raise ValueError("base_url is required")
        self._agent=api_key.startswith("ea_live_")
        if self._agent and not environment_id: raise ValueError("environment_id is required for agent credentials")
        self.api_key,self.base_url,self.environment_id,self.timeout,self.cache_ttl,self._opener,self._cache=api_key,base_url.rstrip("/"),environment_id,timeout,cache_ttl,opener,{}
    def _secrets_path(self,suffix:str="")->str:
        return f"/agent/environments/{self.environment_id}/secrets{suffix}" if self._agent else f"/sdk/secrets{suffix}"
    def _request(self,path:str):
        request=Request(f"{self.base_url}/api/v1{path}",headers={"Authorization":f"Bearer {self.api_key}","Accept":"application/json"})
        try:
            with self._opener(request,timeout=self.timeout) as response: payload=json.loads(response.read())
        except HTTPError as error:
            try: message=json.loads(error.read()).get("error",{}).get("message",str(error))
            except Exception: message=str(error)
            cls={401:AuthenticationError,403:PermissionError,404:SecretNotFoundError}.get(error.code,ServerError);raise cls(message) from error
        except (URLError,TimeoutError,OSError) as error: raise NetworkError("Unable to reach EnvSync") from error
        return payload["data"]
    def get(self,name:str)->str:
        if not name: raise ValueError("Secret name is required")
        cached=self._cache.get(name)
        if cached and cached[1]>time.monotonic(): return cached[0]
        from urllib.parse import quote
        value=self._request(self._secrets_path(f"/{quote(name,safe='')}"))["value"]
        if self.cache_ttl>0:self._cache[name]=(value,time.monotonic()+self.cache_ttl)
        return value
    def get_many(self,names:list[str])->dict[str,str]: return {name:self.get(name) for name in names}
    def get_all(self)->dict[str,str]:
        data=self._request(self._secrets_path())
        return {item["name"]:self.get(item["name"]) for item in data} if self._agent else data
    def health(self)->bool:
        try:
            with self._opener(Request(f"{self.base_url}/health"),timeout=self.timeout) as response:return response.status==200
        except Exception:return False
    def reload(self,name:str|None=None)->None: self._cache.pop(name,None) if name else self._cache.clear()
