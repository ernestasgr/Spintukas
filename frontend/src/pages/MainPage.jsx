import {
  Box,
  Heading,
  Button,
  VStack,
  Text,
  Link as ChakraLink,
  Wrap,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

const MainPage = () => {
  const isAdmin = localStorage.getItem("is_admin") === "true";

  return (
    <Box p={8}>
      <VStack spacing={4} align="center">
        <Heading as="h1" size="xl">
          UAB &quot;Spintukas&quot;
        </Heading>
        <Text fontSize="lg" textAlign="center">
          Welcome to the defect registering system for furniture. Please use the
          buttons below to proceed.
        </Text>
        <Text fontSize="md" textAlign="center">
          You are currently logged in as: {localStorage.getItem("username")}
        </Text>
        <Wrap justify="center">
          <ChakraLink as={ReactRouterLink} to="/register-defect">
            <Button colorScheme="blue" size="lg">
              Register Defect
            </Button>
          </ChakraLink>
          {isAdmin && ( // Conditionally render if isAdmin is true
            <ChakraLink as={ReactRouterLink} to="/manage-defects">
              <Button colorScheme="green" size="lg">
                Manage Defects
              </Button>
            </ChakraLink>
          )}
          <ChakraLink as={ReactRouterLink} to="/my-defects">
            <Button colorScheme="red" size="lg">
              My Defects
            </Button>
          </ChakraLink>
        </Wrap>
      </VStack>
    </Box>
  );
};

export default MainPage;
