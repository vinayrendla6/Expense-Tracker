import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Modal, Select, Table, DatePicker, App } from "antd";
import {
    UnorderedListOutlined,
    AreaChartOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";

const { RangePicker } = DatePicker;

const HomePage = () => {
    const { message } = App.useApp();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allTransection, setAllTransection] = useState([]);
    const [frequency, setFrequency] = useState("7");
    const [selectedDate, setSelectedate] = useState([]);
    const [type, setType] = useState("all");
    const [viewData, setViewData] = useState("table");
    const [editable, setEditable] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
        },
        {
            title: "Amount",
            dataIndex: "amount",
        },
        {
            title: "Type",
            dataIndex: "type",
        },
        {
            title: "Category",
            dataIndex: "category",
        },
        {
            title: "Reference",
            dataIndex: "reference",
        },
        {
            title: "Actions",
            render: (text, record) => (
                <div>
                    <EditOutlined
                        onClick={() => {
                            setEditable(record);
                            setShowModal(true);
                        }}
                    />
                    <DeleteOutlined
                        className="mx-2"
                        onClick={() => {
                            handleDelete(record);
                        }}
                    />
                </div>
            ),
        },
    ];

    const getAllTransactions = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            setLoading(true);
            const res = await axios.post("/transections/get-transection", {
                userid: user._id,
                frequency,
                selectedDate,
                type,
            });
            setLoading(false);


            const mappedData = res.data.map(item => ({
                ...item,
                reference: item.reference || item.refrence || '',
            }));

            setAllTransection(mappedData);
        } catch (error) {
            console.log(error);
            message.error("Fetch Issue With Transaction");
        }
    }, [frequency, selectedDate, type, message]);

    useEffect(() => {
        getAllTransactions();
    }, [getAllTransactions]);

    useEffect(() => {
        if (editable) {
            form.setFieldsValue({
                ...editable,
                date: moment(editable.date),
                reference: editable.reference,
            });
        }
    }, [editable, form]);

    const handleDelete = async (record) => {
        try {
            setLoading(true);
            await axios.post("/transections/delete-transection", {
                transacationId: record._id,
            });
            setLoading(false);
            message.success("Transaction Deleted!");
            getAllTransactions();
        } catch (error) {
            setLoading(false);
            console.log(error);
            message.error("Unable to delete");
        }
    };

    const handleSubmit = async (values) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            setLoading(true);
            if (editable) {
                const payload = {
                    ...values,
                    date: moment(values.date).format("YYYY-MM-DD"),
                    userId: user._id,
                };
                await axios.post("/transections/edit-transection", {
                    payload,
                    transacationId: editable._id,
                });
                setLoading(false);
                message.success("Transaction Updated Successfully");
            } else {
                const payload = {
                    ...values,
                    date: moment(values.date).format("YYYY-MM-DD"),
                    userid: user._id,
                };
                await axios.post("/transections/add-transection", payload);
                setLoading(false);
                message.success("Transaction Added Successfully");
            }
            setShowModal(false);
            setEditable(null);
            getAllTransactions();
        } catch (error) {
            setLoading(false);
            message.error("Failed to add transaction");
        }
    };

    return (
        <Layout>
            {loading && <Spinner />}
            <div className="filters">
                <div>
                    <h6>Select Frequency</h6>
                    <Select value={frequency} onChange={(values) => setFrequency(values)}>
                        <Select.Option value="7">LAST 1 Week</Select.Option>
                        <Select.Option value="30">LAST 1 Month</Select.Option>
                        <Select.Option value="365">LAST 1 year</Select.Option>
                        <Select.Option value="custom">custom</Select.Option>
                    </Select>
                    {frequency === "custom" && (
                        <RangePicker
                            value={selectedDate}
                            onChange={(values) => setSelectedate(values)}
                        />
                    )}
                </div>
                <div>
                    <h6>Select Type</h6>
                    <Select value={type} onChange={(values) => setType(values)}>
                        <Select.Option value="all">ALL</Select.Option>
                        <Select.Option value="income">INCOME</Select.Option>
                        <Select.Option value="expense">EXPENSE</Select.Option>
                    </Select>
                    {frequency === "custom" && (
                        <RangePicker
                            value={selectedDate}
                            onChange={(values) => setSelectedate(values)}
                        />
                    )}
                </div>
                <div className="switch-icons">
                    <UnorderedListOutlined
                        className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"}`}
                        onClick={() => setViewData("table")}
                    />
                    <AreaChartOutlined
                        className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"}`}
                        onClick={() => setViewData("analytics")}
                    />
                </div>
                <div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        Add New
                    </button>
                </div>
            </div>
            <div className="content">
                {viewData === "table" ? (
                    <Table columns={columns} dataSource={allTransection} />
                ) : (
                    <Analytics allTransection={allTransection} />
                )}
            </div>
            <Modal
                title={editable ? "Edit Transaction" : "Add Transection"}
                open={showModal}
                onCancel={() => {
                    setShowModal(false);
                    setEditable(null);
                    form.resetFields();
                }}
                footer={false}
                destroyOnClose={true}
            >
                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={editable}
                    form={form}
                >
                    <Form.Item label="Amount" name="amount">
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="type" name="type">
                        <Select>
                            <Select.Option value="income">Income</Select.Option>
                            <Select.Option value="expense">Expense</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Category" name="category">
                        <Select>
                            <Select.Option value="salary">Salary</Select.Option>
                            <Select.Option value="tip">Tip</Select.Option>
                            <Select.Option value="project">Project</Select.Option>
                            <Select.Option value="food">Food</Select.Option>
                            <Select.Option value="movie">Movie</Select.Option>
                            <Select.Option value="bills">Bills</Select.Option>
                            <Select.Option value="medical">Medical</Select.Option>
                            <Select.Option value="fee">Fee</Select.Option>
                            <Select.Option value="tax">TAX</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Date" name="date">
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item label="Reference" name="reference">
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input type="text" />
                    </Form.Item>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">
                            SAVE
                        </button>
                    </div>
                </Form>
            </Modal>
        </Layout>
    );
};

export default HomePage;