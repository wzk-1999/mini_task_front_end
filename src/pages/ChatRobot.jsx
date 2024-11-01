import React, { useEffect, useRef } from "react";
import { Row, Col, Layout, Spin,message } from "antd";
import URLInput from "../components/URLInput";
import Chatbox from "../components/Chatbox";
import { useSelector } from "react-redux";
import './spin.css'

const { Content } = Layout;


const ChatRobot = () => {
    const loading = useSelector((state) => state.scraper.loading);
    const classificationResult = useSelector((state) => state.scraper.classificationResult);
    const url = useSelector((state) => state.scraper.url);
    const prevClassificationResult = useRef(null);
    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {
      // console.log(classificationResult)
      // console.log("old: ",prevClassificationResult.current)
      // console.log(classificationResult!== prevClassificationResult.current)
        if (prevClassificationResult.current && classificationResult!== prevClassificationResult.current) {
          messageApi.info(`Visitor profile for ${url} has updated, go to visitor profile page to check analyze result`, 3);      
        }
        prevClassificationResult.current = classificationResult;
    }, [classificationResult]);

    return (
      
        <Content style={{ padding: "24px", minHeight: "100vh"}}>
           {contextHolder}
           <Spin spinning={loading} size="large" tip="Embeding knowledge base, Fetching data..." >
               
            <Row gutter={[16, 16]} >
                {/* Left Column for URL Input */}
                <Col xs={24} sm={24} md={12} lg={12} xl={12} >
                    <div style={{ padding: "16px", border: "1px solid #d9d9d9", borderRadius: "8px", height: "100%" }}>
                        <h2>Fetch URL</h2>
                        <URLInput />
                    </div>
                </Col>

                {/* Right Column for Chatbox */}
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <div style={{ padding: "16px", border: "1px solid #d9d9d9", borderRadius:  "8px", height: "100%" }}>
                        <h2>Chatbox</h2>
                        <Chatbox />
                    </div>
                </Col>
            </Row>
            </Spin>
        </Content>
    );
};

export default ChatRobot;