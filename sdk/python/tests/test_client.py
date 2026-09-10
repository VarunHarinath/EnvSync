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
if __name__=="__main__":unittest.main()
