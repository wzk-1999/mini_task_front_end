import React, { useState, useEffect } from "react";
import { Input, Button, Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setUrl, fetchQuestions } from "../store/slices/scraperSlice";

const URLInput = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.scraper.loading);
  const urlFromRedux = useSelector((state) => state.scraper.url); // 从 Redux 中获取 URL
  const [url, setUrlInput] = useState(urlFromRedux); // 初始化输入框的值

  // 当 Redux 中的 URL 变化时，更新输入框的值
  useEffect(() => {
    setUrlInput(urlFromRedux);
  }, [urlFromRedux]);

  const validateURL = (url) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // Protocol
      "((([a-zA-Z0-9\\-])+\\.)+([a-zA-Z]{2,}))" + // Domain name
      "(\\:\\d{2,5})?" + // Port
      "(\\/.*)?$" // Path
    );
    return urlPattern.test(url);
  };

  const handleSubmit = () => {
    if (validateURL(url)) {
      dispatch(setUrl(url));
      dispatch(fetchQuestions(url)).catch((error) => {
        message.error(error);
      });
    } else {
      message.error("Please enter a valid URL.");
    }
  };

  return (
    <Form layout="inline" onFinish={handleSubmit}>
      <Form.Item>
        <Input
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrlInput(e.target.value)}
          style={{ width: 300 }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Fetch URL
        </Button>
      </Form.Item>
    </Form>
  );
};

export default URLInput;
