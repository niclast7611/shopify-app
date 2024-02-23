import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Text, Card, BlockStack, Link } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import HomeLogin from "~/components/home/home-login";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  // this is where we would see if the user is logged in to ripe metrics
  // if they are not, we would show them a login page
  // if they are, we would show them the main page

  return json({ rm_valid: false });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    },
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data?.productCreate?.product,
  });
};

export default function Index() {
  const { rm_valid } = useLoaderData<typeof loader>();

  // const nav = useNavigation();
  // const actionData = useActionData<typeof action>();
  // const submit = useSubmit();

  return (
    <Page>
      {rm_valid ? (
        <Card>
          <BlockStack gap="500">
            <BlockStack gap="200">
              <Text as="h1" variant="headingLg" alignment="center">
                Welcome to RipeMetrics 🎉
              </Text>
              <Text variant="bodyMd" as="p">
                Your account is all set up! You can now take full advantage of
                our features and integrations to enhance your business
                operations. Visit{" "}
                <Link
                  url="https://ripemetrics.com"
                  target="_blank"
                  removeUnderline
                >
                  RipeMetrics.com
                </Link>{" "}
                to explore more about how we can help you grow.
              </Text>
            </BlockStack>
          </BlockStack>
        </Card>
      ) : (
        <HomeLogin />
      )}
    </Page>
  );
}
