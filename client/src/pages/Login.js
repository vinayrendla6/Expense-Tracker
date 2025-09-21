import React, { useState, useEffect } from "react";
import { Form, Input, App, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "./Login.css";
import expensesImage from "../assests/expenses.jpg";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { message } = App.useApp();

    // submit
    const submitHandler = async (values) => {
        try {
            setLoading(true);
            const { data } = await axios.post("/users/login", values);
            setLoading(false);
            localStorage.setItem(
                "user",
                JSON.stringify({ ...data.user, password: "" })
            );
            message.success("Login successful");
            navigate("/", { replace: true });
        } catch (error) {
            setLoading(false);
            message.error("Something went wrong");
        }
    };

    // already logged-in user
    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div className="login-container">
            {loading && <Spinner />}
            <div className="login-card">
                {/* left image */}
                <div className="login-image-section">
                    <img src={expensesImage} alt="Expenses" />
                </div>

                {/* right form */}
                <div className="login-form-section">
                    <h2>Welcome Back</h2>
                    <p className="subtitle">Login to your account</p>

                    <Form layout="vertical" onFinish={submitHandler}>
                        <Form.Item
                            label="Email Address"
                            name="email"
                            rules={[{ required: true, message: "Please enter your email" }]}
                        >
                            <Input type="email" placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Please enter your password" }]}
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-button"
                            >
                                Login
                            </Button>
                        </Form.Item>

                        <p className="signup-link">
                            Don’t have an account?{" "}
                            <Link to="/register">Sign up here</Link>
                        </p>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
