import React, { useState } from "react";
import { Form, Row, Col, Input, Button } from "antd";
import PropTypes from "prop-types";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import styles from "./index.styl";

const FilterForm = (props) => {
  const { setFormValues } = props
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setFormValues(values)
  };

  const onReset = () => {
    form.resetFields();
    setFormValues({})
  }

  return (
    <Form
      form={form}
      className={styles.form}
      name="advanced_search"
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name={`search`}
            label={`搜索标准`}
            // rules={[
            //   {
            //     required: true,
            //     message: "请输入",
            //   },
            // ]}
          >
            <Input placeholder="请输入搜索标准" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col
          span={24}
          style={{
            textAlign: "right",
          }}
        >
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={onReset}
          >
            重置
          </Button>
          <a
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {expand ? <UpOutlined /> : <DownOutlined />}{" "}
            {expand ? "收起" : "展开"}
          </a>
        </Col>
      </Row>
    </Form>
  );
};

FilterForm.propTypes = {
  setFormValues: PropTypes.func.isRequired
}

export default FilterForm;
