import React from 'react';
import { Layout } from 'antd';
const { Header } = Layout;

export default function () {
    return (
        <Header 
            style={{ 
                lineHeight: '64px', 
                color: '#fff',
                fontStyle: 'italic',
                fontSize: 'large'
            }}
        >
            <span>
                爱丽丝仙境花园
            </span>
        </Header>
    );
};
