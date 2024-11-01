import React, { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { List, Checkbox, Button, message } from "antd";
import MarkdownIt from "markdown-it";
import { submitUserSelection } from "../store/slices/scraperSlice";
import cleanProfileString from "../utils/markdownUtils"

const mdParser = new MarkdownIt();

const Chatbox = () => {
  const { questions } = useSelector((state) => state.scraper);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [submittedQuestions, setSubmittedQuestions] = useState({});
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.scraper.loading);
  const [messageApi, contextHolder] = message.useMessage()

  const handleCheckboxChange = (questionId, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [option]: !prev[questionId]?.[option],
      },
    }));
  };

  const handleSubmit = (questionId) => {
    const options = selectedOptions[questionId];
    if (options && Object.values(options).some((isSelected) => isSelected)) {
      const selectedOptionsString = Object.keys(options)
      .filter((option) => options[option])
      .join(", ");

      // console.log(selectedOptionsString)

      dispatch(submitUserSelection( selectedOptionsString )).catch((error) => {
        message.error(error);
      });;
      console.log(loading)
      // 标记为已提交
      setSubmittedQuestions((prev) => ({ ...prev, [questionId]: true }));
    } else {
      messageApi.warning("Please select at least one option before submitting.");
    }
  };

  const parseMarkdownOptions = (content) => {
    content=cleanProfileString(content)
    const lines = content.split("\n");
    const questionText = lines[0].replace("- [ ]", "").trim();
    const options = lines
      .slice(1)
      .filter((line) => line.startsWith("- [ ]"))
      .map((line) => line.replace("- [ ]", "").trim());
    
    return { questionText, options };
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      {contextHolder}
      <List
        itemLayout="vertical"
        dataSource={questions}
        renderItem={(question) => {
          const { questionText, options } = parseMarkdownOptions(
            question.content
          );

          return (
            <List.Item key={question.id}>
              {/* Display question text separately */}
              <p
                dangerouslySetInnerHTML={{
                  __html: mdParser.renderInline(questionText),
                }}
                style={{ marginBottom: "10px", fontWeight: "bold" }}
              />
              {/* Render each option in the same line as the checkbox */}
              {options.map((option, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Checkbox
                    checked={selectedOptions[question.id]?.[option] || false}
                    onChange={() => handleCheckboxChange(question.id, option)}
                    disabled={submittedQuestions[question.id]}
                    style={{ marginRight: "8px" }}
                  />
                  <span>{option}</span>
                </div>
              ))}
              {!submittedQuestions[question.id] && (
                <Button
                  type="primary"
                  onClick={() => handleSubmit(question.id)}
                  style={{ marginTop: "10px" }}
                  loading={loading}
                >
                  Submit
                </Button>
              )}
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default Chatbox;
