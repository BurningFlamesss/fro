import { createServerFn } from "@tanstack/react-start";

export const getWeatherReport = createServerFn({ method: "POST" })
	.validator((data: { city_name: string }) => data)
	.handler(async ({ data }) => {
		try {
			const appId = process.env.WEATHER_API_KEY;

            if (!appId) {
				return {
					error: "No AppId",
					success: false,
					data: null,
				};
			}
			const url = `https://api.openweathermap.org/data/2.5/weather?q=${data.city_name}&appid=${appId}`;

			const response = await fetch(url);
			const jsonData = await response.json();

			console.log("JsonData: ", jsonData);

			return {
				success: true,
				data: jsonData,
			};
		} catch (error) {
			return {
				error: "Unexpected Error Occured",
				success: false,
				data: null,
			};
		}
	});
