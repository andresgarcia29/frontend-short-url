import React from "react";
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
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import SplitText from "./components/SplitText";
import AnimatedDiv from "./components/AnimatedDiv";
import { useSpring } from "@react-spring/web";
import { isUrl } from "./helpers/isUrl";

interface ShortUrl {
  url: string;
  message: string;
  code: string;
}

function App() {
  const spaceStyle: React.CSSProperties = {
    height: "100vh",
  };
  const [api, contextHolder] = notification.useNotification();

  const [shortUrl, setShortUrl] = React.useState("");
  const [bigUrl, setbigUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const makeShortUrl = async () => {
    setIsLoading(true);
    await fetchGetShortUrl();
    setIsLoading(false);
    setbigUrl("");
  };

  const fetchGetShortUrl = async () => {
    try {
      if (!isUrl(bigUrl)) {
        throw new Error("Invalid URL");
      }

      const response = await fetch("https://short.corvux.co", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ url: bigUrl, createdBy: "frontend" }),
      });
      const body: ShortUrl = await response.json();

      if (!response.ok) {
        throw new Error(body.message);
      }
      setShortUrl(body.url);
    } catch (error) {
      api["error"]({
        message: <div className="text-white">Error to generate short url</div>,
        description: <div className="text-white">{`${error}`}</div>,
        className: "bg-black border-2 border-red-500/100 rounded-lg",
      });
    }
  };

  const resultAnimationsProps = useSpring({
    opacity: shortUrl ? 1 : 0,
    delay: 500,
  });

  return (
    <>
      {contextHolder}
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <Layout>
          <Flex style={spaceStyle} justify="center" align="center" vertical>
            <Flex
              className="h-screen relative"
              gap="middle"
              justify="center"
              align="center"
              vertical
            >
              <Image width={200} src="/www.png" preview={false}></Image>
              <SplitText
                text="Make your URL shorter!"
                className="text-4xl text-white font-bold"
                delay={100}
                animationFrom={{
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
                }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                easing={(t: number) => t}
                threshold={0.2}
                rootMargin="-50px"
              />
              <Input
                placeholder="Insert you long url..."
                size="large"
                value={bigUrl}
                onChange={(e) => setbigUrl(e.target.value)}
              ></Input>
              <Button
                type="primary"
                size="large"
                onClick={makeShortUrl}
                loading={isLoading}
              >
                Go shorter!
              </Button>
            </Flex>
            <AnimatedDiv style={resultAnimationsProps}>
              <Flex
                justify="center"
                align="center"
                vertical
                className="absolute bottom-0 left-0 right-0"
              >
                <Space.Compact className="w-md mb-10">
                  <Input value={shortUrl} />
                  <Popover content="Click to copy">
                    <Button
                      variant="solid"
                      color="purple"
                      onClick={() => navigator.clipboard.writeText(shortUrl)}
                      icon={<CopyOutlined />}
                    ></Button>
                  </Popover>
                </Space.Compact>
              </Flex>
            </AnimatedDiv>
          </Flex>
        </Layout>
      </ConfigProvider>
    </>
  );
}

export default App;
