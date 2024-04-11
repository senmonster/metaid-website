"use client";

import { useMantineColorScheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
		},
	},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
	const { colorScheme } = useMantineColorScheme();

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ToastContainer
				position="top-center"
				toastStyle={{
					width: "380px",
				}}
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme={colorScheme === "dark" ? "dark" : "light"}
				closeButton={false}
			/>
			<ReactQueryDevtools initialIsOpen={true} />
		</QueryClientProvider>
	);
}
