import io,json,unittest
from envsync import EnvSync
class Response:
    status=200
    def __enter__(self):return self
    def __exit__(self,*_):pass
    def read(self):return json.dumps({"success":True,"data":{"value":"safe"}}).encode()
class TestSDK(unittest.TestCase):
    def test_get_and_cache(self):
        calls=[]
        def opener(*args,**kwargs):calls.append(args);return Response()
        sdk=EnvSync("es_live_example","http://example",cache_ttl=10,opener=opener)
        self.assertEqual(sdk.get("A"),"safe");self.assertEqual(sdk.get("A"),"safe");self.assertEqual(len(calls),1)
    def test_agent_credentials_are_environment_scoped(self):
        with self.assertRaises(ValueError): EnvSync("ea_live_example","http://example")
        calls=[]
        def opener(request,**kwargs):calls.append(request.full_url);return Response()
        sdk=EnvSync("ea_live_example","http://example",environment_id="environment-id",opener=opener)
        self.assertEqual(sdk.get("A"),"safe")
        self.assertEqual(calls[0],"http://example/api/v1/agent/environments/environment-id/secrets/A")
if __name__=="__main__":unittest.main()
