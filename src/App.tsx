import { useState, useCallback } from "react";
import {
  Button,
  ConfigProvider,
  Image,
  theme,
  Input,
  Flex,
  Layout,
  Space,
  notification,
  Popover,
  Typography,
} from "antd";
import { CopyOutlined, LinkOutlined } from "@ant-design/icons";
import SplitText from "./components/SplitText";
import AnimatedDiv from "./components/AnimatedDiv";
import { useSpring } from "@react-spring/web";
import { isUrl } from "./helpers/isUrl";
import { ShortUrl } from "./types";

const { Title } = Typography;

// Extract API URL to environment variable
const API_URL = "https://short.corvux.co";

function App() {
  const [api, contextHolder] = notification.useNotification();
  const [shortUrl, setShortUrl] = useState("");
  const [bigUrl, setBigUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Memoize expensive animation calculations
  const resultAnimationsProps = useSpring({
    opacity: shortUrl ? 1 : 0,
    delay: 500,
  });

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      api.success({
        message: <div className="text-white">Copied!</div>,
        description: (
          <div className="text-white">URL has been copied to clipboard</div>
        ),
        placement: "top",
        className: "bg-black border-2 border-green-500/100 rounded-lg",
      });
    } catch {
      api.error({
        message: <div className="text-white">Copy failed</div>,
        description: (
          <div className="text-white">Please try again or copy manually</div>
        ),
        className: "bg-black border-2 border-red-500/100 rounded-lg",
      });
    }
  }, [shortUrl, api]);

  const makeShortUrl = useCallback(async () => {
    // Clear previous error state
    setError("");

    // Form validation
    if (!bigUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!isUrl(bigUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: bigUrl,
          createdBy: "frontend",
        }),
      });

      const body: ShortUrl = await response.json();

      if (!response.ok) {
        throw new Error(body.message || "Failed to generate short URL");
      }

      setShortUrl(body.url);
      api.success({
        message: <div className="text-white">Success!</div>,
        description: <div className="text-white">Your short URL is ready</div>,
        className: "bg-black border-2 border-green-500/100 rounded-lg",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      api.error({
        message: <div className="text-white">Failed to generate short URL</div>,
        description: <div className="text-white">{errorMessage}</div>,
        className: "bg-black border-2 border-red-500/100 rounded-lg",
      });
    } finally {
      setIsLoading(false);
    }
  }, [bigUrl, api]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        makeShortUrl();
      }
    },
    [makeShortUrl]
  );

  const handleReset = useCallback(() => {
    setBigUrl("");
    setShortUrl("");
    setError("");
  }, []);

  return (
    <>
      {contextHolder}
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <Layout style={{ minHeight: "100vh" }}>
          <Flex
            justify="center"
            align="center"
            vertical
            style={{ height: "100vh", padding: "1rem" }}
          >
            <Flex
              className="relative"
              gap="middle"
              justify="center"
              align="center"
              vertical
            >
              <Image
                width={200}
                src="/www.png"
                preview={false}
                alt="URL Shortener Logo"
              />

              <SplitText
                text="Make your URL shorter!"
                className="text-4xl text-white font-bold"
                delay={100}
                animationFrom={{
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
                }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                easing={(t) => t}
                threshold={0.2}
                rootMargin="-50px"
              />

              <div style={{ width: "100%", maxWidth: "500px" }}>
                <Input
                  placeholder="Insert your long URL..."
                  size="large"
                  value={bigUrl}
                  onChange={(e) => setBigUrl(e.target.value)}
                  onKeyDown={handleKeyPress}
                  prefix={<LinkOutlined />}
                  status={error ? "error" : ""}
                  aria-label="URL to shorten"
                />
                {error && (
                  <Typography.Text
                    type="danger"
                    style={{ display: "block", marginTop: "4px" }}
                  >
                    {error}
                  </Typography.Text>
                )}
              </div>

              <Space>
                <Button
                  type="primary"
                  size="large"
                  onClick={makeShortUrl}
                  loading={isLoading}
                  disabled={!bigUrl.trim()}
                  aria-label="Shorten URL"
                >
                  Go shorter!
                </Button>

                {shortUrl && (
                  <Button
                    size="large"
                    onClick={handleReset}
                    aria-label="Reset form"
                  >
                    Reset
                  </Button>
                )}
              </Space>
            </Flex>

            <AnimatedDiv style={resultAnimationsProps}>
              <Flex
                justify="center"
                align="center"
                vertical
                className="absolute bottom-4 left-0 right-0 mb-10"
              >
                <Title
                  level={5}
                  style={{ marginBottom: "8px", color: "white" }}
                >
                  Your shortened URL:
                </Title>
                <Space.Compact style={{ maxWidth: "500px", width: "100%" }}>
                  <Input
                    value={shortUrl}
                    readOnly
                    aria-label="Generated short URL"
                  />
                  <Popover content="Click to copy">
                    <Button
                      type="primary"
                      onClick={copyToClipboard}
                      icon={<CopyOutlined />}
                      aria-label="Copy to clipboard"
                    />
                  </Popover>
                </Space.Compact>
                <Typography.Text style={{ marginTop: "8px", color: "#ccc" }}>
                  Click the button to copy
                </Typography.Text>
              </Flex>
            </AnimatedDiv>
          </Flex>
        </Layout>
      </ConfigProvider>
    </>
  );
}

export default App;
