import React from "react";  
import { useSelector } from "react-redux";  
import WordCloud from "react-d3-cloud";  
import { Flex } from 'antd';  
  
const Profile = () => {  
    const url = useSelector((state) => state.scraper.url);  
    const classificationResult = useSelector((state) => state.scraper.classificationResult);  
  
    // 如果classificationResult为空，则不处理数据  
    if (!classificationResult) {  
        return (  
            <div>  
                <Flex justify={'center'}><h2><strong>Visitor profile for</strong> <i style={{ color: 'green' }}>{url}</i></h2></Flex>  
                <p>No classification data available.</p>  
            </div>  
        );  
    }  
  
    // 将classificationResult按逗号分割并去除空白字符串  
    const wordsArray = classificationResult.split(",").filter(word => word.trim() !== "");  
  
    // 用于统计每个单词出现次数的对象  
    const wordFrequency = {};  
  
    // 遍历数组，统计每个单词的出现次数  
    wordsArray.forEach((word) => {  
        const trimmedWord = word.trim();  
        if (wordFrequency[trimmedWord]) {  
            wordFrequency[trimmedWord]++;  
        } else {  
            wordFrequency[trimmedWord] = 1;  
        }  
    });  
  
    // 构建词云数据  
    const data = Object.keys(wordFrequency).map(word => ({  
        text: word,  
        value: 200 * wordFrequency[word]  
    }));  
  
    return (  
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>  
            <Flex justify={'center'}><h2><strong>Visitor profile for</strong> <i style={{ color: 'green' }}>{url}</i></h2></Flex>  
            <div>  
                <WordCloud data={data}/>  
            </div>  
        </div>  
    );  
};  
  
export default Profile;