# Full-stack Template

This template provides a fully functional CRUD app. Once a user has successfully registered for an account and logged in, they can see their existing items, create new items, update existing items, and delete items, add imges for items, and add reviews for those items.

## Getting Started

1: Get All Items

- Endpoint: `/items`
- Method: `GET`
- Description: It gets all the items filterted by description
- Response: Array of items and reviews.

2: Get item by id

- Endpoint: `/items/:id`
- Method: `GET`
- Description: Retrieves a specific item by its ID.
- Response: Object of item and reviews.

3: Create new item

- Endpoint: `/items`
- Method: `POST`
- Description: Creates a new item.
- Response: Object of the createad item .
- Request Body:
- `description`: Description of the item (required).
- `imageUrl`: URL of the item's image.

4: Update item

- Endpoint: `/items/:itemId`
- Method: `PUT`
- Description: Updates an item.
- Response: Object of the Updated item.
- Request Body:
- `description`: Description of the item (required).
- `imageUrl`: URL of the item's image.

5: Delete item

- Endpoint: `/items/:id`
- Method: `DELETE`
- Description: Deletes an item.
- Response: status message

6: Get reviews

- Endpoint: `/reviews`
- Method: `GET`
- Description: It gets all the reviews
- Response: Array of reviews.

7: Create review

- Endpoint: `/reviews/:id`
- Method: `POST`
- Description: Retrieves a specific review by its ID.
- Response: Object of reviews.
- Request Body:
  - `itemId`: ID of the item being reviewed(required).
  - `reviewText`: Text of the review (required).
  - `rating`: Rating of the item (required).

8: Update review

- Endpoint: `/reviews/:itemId`
- Method: `PUT`
- Description: Updates a review.
- Response: Object of the Updated review.
- Request Body:
  - `reviewText`: Text of the review (required).
  - `rating`: Rating of the item (required).

9: Delete review

- Endpoint: `/reviews/:id`
- Method: `DELETE`
- Description: Deletes a review.
- Response: status message
