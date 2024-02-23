import { json } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Form,
  FormLayout,
  Link,
  Text,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";

type Props = {};

export const action = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  console.log("Submitting:", { email, password });
  return json({
    status: 200,
  });
};

const HomeLogin = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = useSubmit();

  const submitLogin = () => submit({}, {});

  return (
    <Card>
      <BlockStack gap="500">
        <Text as="h2" variant="headingMd" alignment="center">
          Your RipeMetrics Account Is Not Set Up Yet
        </Text>
        <Text variant="bodyMd" as="p" alignment="center">
          Please log in to your existing account or create a new one to get
          started with RipeMetrics. This will enable you to access all our
          features and integrate seamlessly with your Shopify store.
        </Text>
        <BlockStack gap="300">
          <Form onSubmit={submitLogin}>
            <FormLayout>
              <TextField
                value={email}
                onChange={setEmail}
                label="Email"
                type="email"
                autoComplete="email"
                helpText={
                  <span>We'll never share your email with anyone else.</span>
                }
              />
              <TextField
                value={password}
                onChange={setPassword}
                label="Password"
                type="password"
                autoComplete="current-password"
              />
              <ButtonGroup>
                <Button submit>Log In</Button>
                <Link
                  url="https://ripemetrics.com/signup" // Assume this is the URL for account creation
                  target="_blank"
                >
                  Create Account
                </Link>
              </ButtonGroup>
            </FormLayout>
          </Form>
        </BlockStack>
      </BlockStack>
    </Card>
  );
};

export default HomeLogin;
