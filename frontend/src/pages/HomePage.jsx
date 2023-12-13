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

export const HomePage = () => {
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
        <Wrap justify="center">
          <ChakraLink as={ReactRouterLink} to="/register">
            <Button size="lg">Register</Button>
          </ChakraLink>
          <ChakraLink as={ReactRouterLink} to="/login">
            <Button size="lg">Login</Button>
          </ChakraLink>
        </Wrap>
      </VStack>
    </Box>
  );
};
