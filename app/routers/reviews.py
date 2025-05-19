# from fastapi import APIRouter, Depends, status, HTTPException
# from sqlalchemy import select, insert
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.sql.annotation import Annotated
#
# from app.backend.db_depends import get_db
# from app.models import Product
# from app.models.rating import Rating
# from app.models.review import Review
# from app.routers.auth import get_current_user
# from app.schemas import CreateReview
#
# router = APIRouter(prefix="/reviews", tags=["reviews"])
#
# @router.get('/')
# async def all_reviews(db: Annotated[AsyncSession, Depends(get_db)]):
#     reviews = await db.scalars(select(Review).where(Review.is_active == True))
#     if reviews is None:
#         raise HTTPException(status_code=404, detail="No reviews found")
#     return reviews.all()
#
# @router.get('/{product_id}')
# async def products_reviews(db: Annotated[AsyncSession, Depends(get_db)], product_id: int):
#     reviews_for_product_id = await db.scalars(select(Review)
#                                               .where(Review.product_id == product_id and Review.is_active == True))
#     if reviews_for_product_id is None:
#         raise HTTPException(status_code=404, detail="No reviews found")
#     return reviews_for_product_id.all()
#
# @router.post('/')
# async def add_review(db: Annotated[AsyncSession, Depends(get_db)], review: CreateReview, rating: Rating,
#                          get_user: Annotated[dict, Depends(get_current_user)]):
#     if get_user.get('is_supplier') or get_user.get('is_admin'):
#         product = db.scalars(select(Product).where(Product.id == review.product_id)).first()
#         if product is None:
#             raise HTTPException(status_code=404, detail="No reviews product")
#         await db.execute(insert(Rating).values(grade = rating.grade,
#                                                product_id=product.id,
#                                                user_id = rating.id,
#                                                is_active= rating.is_active,))
#         await db.execute(insert(Review).values(user_id=review.user_id,
#                                                  product_id=product.id,
#                                                  rating_id=review.rating,
#                                                  comment=review.comment,
#                                                  comments_data=review.comments_data,
#                                                  is_active=review.is_active,))
#         await db.commit()
#         return {
#             'status_code': status.HTTP_201_CREATED,
#             'transaction': 'Successful'
#         }
#     else:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail='You have not enough permission for this action'
#         )
#
# @router.delete('/')
# async def delete_reviews(db: Annotated[AsyncSession, Depends(get_db)], product_id: int,
#                          get_user: Annotated[dict, Depends(get_current_user)]):
#     pass