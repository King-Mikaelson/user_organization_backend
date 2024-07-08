import request from "supertest";
import { app } from "../src/index.ts"; // Your Express app
import { v4 as uuidv4 } from "uuid";
import { createServer } from 'http';
import { AddressInfo } from 'net';

// Generate a UUID (v4)
const userId: string = uuidv4();

// Create a random email address using UUID
const randomEmail: string = `${userId}@example.com`;

const server = createServer(app);

beforeAll((done) => {
  server.listen(0, () => { // Use 0 to let the OS assign an available port
    const { port } = server.address() as AddressInfo;
    process.env.PORT = port.toString();
    done();
  });
});

afterAll((done) => {
  server.close(done);
});
describe("/AuthRoutes", () => {

  test("should register user successfully with default organisation", async () => {
    const registerRes = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: randomEmail,
      password: "password12345",
      phone: "07049078543",
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.data.user).toHaveProperty("userId");
    expect(registerRes.body.data.user).toHaveProperty("email", randomEmail);
    expect(registerRes.body.data).toHaveProperty("accessToken");

    let orgRes = await request(app)
      .get(`/organisations`)
      .set("Authorization", `Bearer ${registerRes.body.data.accessToken}`);
    let organisation = orgRes.body.data.organisations.find(
      (data) => data.name === "John's Organisation"
    );
    expect(orgRes.status).toBe(200);
    expect(organisation).toHaveProperty("name", "John's Organisation");
  }, 150000);



  test("should login user successfully", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "anazodomichael27@gmail.com", password: "Password12*" });
  
    expect(res.status).toBe(200);
    expect(res.body.data.user).toHaveProperty("userId");
    expect(res.body.data.user).toHaveProperty(
      "email",
      "anazodomichael27@gmail.com"
    );
    expect(res.body.data).toHaveProperty("accessToken");
  }, 100000);
  
  test("should fail if required fields are missing", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email1: randomEmail, password1: "password" });
  
    expect(res.status).toBe(422);
    expect(res.body.errors).toContainEqual({
      field: "firstName",
      message: "First name is required",
    });
    expect(res.body.errors).toContainEqual({
      field: "lastName",
      message: "Last name is required",
    });
    expect(res.body.errors).toContainEqual({
      field: "email",
      message: "Email is required",
    });
    expect(res.body.errors).toContainEqual({
      field: "password",
      message: "Password is required",
    });
  }, 100000);
  
  test("should fail if there is a duplicate email", async () => {
    await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: randomEmail,
      password: "password12345",
      phone: "07049078543",
    });
  
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: randomEmail,
      password: "password12345",
      phone: "07049078543",
    });
  
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "Registration unsuccessful",
      status: "Bad request",
      statusCode: 400,
    });
  }, 100000);
});


