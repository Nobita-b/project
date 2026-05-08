from supabase_client import database
response= database.table("sherlock").select("*").execute()

print(response.data)