from fastapi import FastAPI
from app.routers import categorys, products, auth, permission
app = FastAPI()


@app.get("/")
async def welcome() -> dict:
    return {"message": "My e-commerce app"}


app.include_router(categorys.router)
app.include_router(products.router)
app.include_router(auth.router)
app.include_router(permission.router)
