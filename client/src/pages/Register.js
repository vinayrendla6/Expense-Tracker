import React, { useState, useEffect } from "react";
import { Form, Input, App, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "./Register.css";
import expensesImage from '../assests/expenses.jpg';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    const submitHandler = async (values) => {
        try {
            setLoading(true);
            await axios.post("/users/register", values);
            message.success("Registration Successful!");
            setLoading(false);
            navigate("/login");
        } catch (error) {
            setLoading(false);
            message.error("Something went wrong");
        }
    };

    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div className="registration-container">
            {loading && <Spinner />}
            <div className="registration-card">
                <div className="registration-form-section">
                    <h2>REGISTER</h2>
                    <Form layout="vertical" onFinish={submitHandler}>
                        <Form.Item label="Name" name="name">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="email">
                            <Input type="email" />
                        </Form.Item>
                        <Form.Item label="Password" name="password">
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="register-button">
                                REGISTER
                            </Button>
                        </Form.Item>
                        <div className="login-link">
                            <Link to="/login" style={{ textDecoration: 'none' }}>Already Registered? Click here to login</Link>
                        </div>
                    </Form>
                </div>
                <div className="registration-image-section">
                    <img src={expensesImage} alt="Expenses" />
                </div>
            </div>
        </div>
    );
};

export default Register;