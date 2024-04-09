# Authorization Microservices with Docker Compose
This project demonstrates a basic setup for fine-grained authorization on microservices using Docker Compose. It includes three services: `user-service`, `order-service`, and `opa-service`, each performing specific functions related to user management, order processing, and authorization policy evaluation using Open Policy Agent (OPA).

## Prerequisites
Make sure you have Docker and Docker Compose installed on your system.

## Running the Services
```bash
docker-compose up --build

```
Once the services are up and running, you can access the following endpoints:
- User Service: http://localhost:3000
- Order Service: http://localhost:4000
- OPA Service: http://localhost:8181

## Docker Sidecar container
Ideally, all services would run on the same network as the opa service, facilitating communication and reducing latencies determining the access control . The `opa-service` can be setup as sidecar container alongside the other services, handling authorisation policy evaluation centrally.

## Access Control

The `opa-service` evaluates authorization policies based on user roles and access time. By default, only authenticated users with admin roles have access to certain endpoints during working hours. You can modify the authorization policies in the Rego files (`authz.rego`) within the `opa-service` directory to customize access control rules according to your requirements.

## Potential Improvements

- **Testing**: Enhance the codebase by adding tests for each service to ensure functionality and prevent regressions.
- **Configuration**: Remove hard-coded URLs from the order and user services, and instead use environment variables or configuration files for better flexibility and portability.
- **Role Acquisition**: Implement a more robust and secure method for acquiring user roles in the services, following best practices. Roles can be extracted from JWTs or dynamically defined at service level.
- **Express Middleware**: Consider moving the request for authorisation from the OPA service to an Express middleware in the services for improved performance and reliability.
