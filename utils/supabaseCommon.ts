export const handleResponse = <T>(data: { data: T; error: null } | { data: null; error: Error }) => {
	if (data.error) {
		throw data.error
	}

	return data.data
}
