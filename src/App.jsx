import { useState } from "react";
import { Form, Input, Select, Button, Card, Typography, Spin } from "antd";
import "antd/dist/reset.css";

const { Option } = Select;
const { Title } = Typography;

const initialValues = {
  chain_id: 1,
  genre: "art"
};

const RecommendationForm = () => {
  const [results, setResults] = useState([
    {
      chain_id: 1,
      contract_address: "0x33FD426905F149f8376e227d0C9D3340AaD17aF1",
      token_id: "27"
    },
    {
      chain_id: 1,
      contract_address: "0xA6Df7B5714D56296Aa107dE3A84D8F3006451709",
      token_id: "1"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    console.log("Received values:", values);
    try {
      const { chain_id, wallet_address, genre } = values;
      const response = await fetch(
        "https://nft-hackathon.api-ai.d-metacommunication-stg.com/match/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": "hackason-opensea-2024_XXX"
          },
          body: JSON.stringify({
            chain_id: parseInt(chain_id),
            wallet_address,
            limit: 10,
            genre
          })
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResults(data.items);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async (contractAddress, tokenId) => {
    try {
      // Example: Fetch metadata using OpenSea API
      const response = await fetch(
        `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return null;
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "20px" }}>
      <Title level={2}>NFT Recommendation</Title>
      <Form
        name="recommendationForm"
        onFinish={onFinish}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="chain_id"
          label="Chain"
          rules={[{ required: true, message: "Please select a chain" }]}
        >
          <Select placeholder="Select blockchain">
            <Option value={1}>Ethereum</Option>
            <Option value={42161} disabled>
              Arbitrum
            </Option>
            <Option value={137} disabled>
              Polygon
            </Option>
            <Option value={56} disabled>
              Binance Smart Chain (BNB)
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="wallet_address"
          label="Wallet Address"
          rules={[
            { required: true, message: "Please input your wallet address" }
          ]}
        >
          <Input placeholder="Enter wallet address" />
        </Form.Item>

        <Form.Item
          name="genre"
          label="Genre"
          rules={[{ required: true, message: "Please select a genre" }]}
        >
          <Select
            name="genre"
            placeholder="Select genre"
            style={{ width: "100%" }}
          >
            <Option value="art">Art</Option>
            <Option value="game">Game</Option>
            <Option value="membership">Membership</Option>
            <Option value="music">Music</Option>
            <Option value="photo">Photo</Option>
            <Option value="world">World</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Get Recommendations
          </Button>
        </Form.Item>
      </Form>

      {loading && <Spin />}

      {results.length > 0 && (
        <div>
          <Title level={3}>Recommendations:</Title>
          {results.map((item, index) => (
            <Card key={index} style={{ marginBottom: "20px" }}>
              <p>Chain ID: {item?.chain_id}</p>
              <p>Contract Address: {item?.contract_address}</p>
              <p>Token ID: {item?.token_id}</p>
              <Button
                type="link"
                href={`https://opensea.io/assets/${item?.contract_address}/${item?.token_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on OpenSea
              </Button>
              <Button
                type="link"
                onClick={() => {
                  fetchMetadata(item.contract_address, item.token_id).then(
                    (metadata) => {
                      if (metadata) {
                        console.log("Metadata:", metadata);
                        // Handle displaying metadata, e.g., showModal, etc.
                      }
                    }
                  );
                }}
              >
                Fetch Metadata
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationForm;
