# Vogues - BackEnd

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" />
</p>

> A robust, secure, and scalable RESTful API built to power the Vogues e-commerce platform. Designed for high performance, seamless payments, and reliable data management.

Vogues BackEnd provides the essential infrastructure for managing the e-commerce store. From secure user authentication and product inventory management to processing payments via Stripe webhooks, this API ensures that all operations are executed smoothly and securely. It leverages MongoDB for flexible data storage and Cloudinary for efficient media asset management.

## Key Features

- **Secure Authentication**: JWT-based authentication and role-based access control (Admin & User roles).
- **Payment Processing**: Fully integrated Stripe checkout and webhook handling for secure transactions.
- **Media Management**: Automated image uploading and processing via Cloudinary integration.
- **RESTful Architecture**: Clean, modular, and scalable route and controller structure.
- **Database Reliability**: Mongoose ODM for structured, validated MongoDB interactions.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance (Local or Atlas)
- Cloudinary Account
- Stripe Account

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Vogues-BackEnd
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy the example environment file and configure your API keys:
   ```bash
   cp .env.example .env
   ```
   *Required keys include `MONGODB_URI`, `JWT_SECRET`, Stripe webhooks, and Cloudinary credentials.*

4. **Start the development server:**
   ```bash
   npm run server
   ```
   The API will be available at `http://localhost:4000`.

## API Structure

```text
/api
├── /user       # User registration, login, and profile management
├── /admin      # Admin-specific administrative endpoints
├── /product    # CRUD operations for the product catalog
├── /cart       # Shopping cart management
└── /order      # Order placement and Stripe webhook handling
```

## Contributing

We encourage contributions! Please ensure your code adheres to the existing architecture. Test your changes locally before submitting a pull request.
