# EnvSync Python SDK
```python
from envsync import EnvSync
client = EnvSync(api_key=os.environ["ENVSYNC_API_KEY"], base_url="https://envsync.acme.internal")
database_url = client.get("DATABASE_URL")
```
