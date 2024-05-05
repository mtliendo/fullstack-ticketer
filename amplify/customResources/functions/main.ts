exports.handler = async (event: any) => {
	console.log('EVENT: \n' + JSON.stringify(event, null, 2))
	return event
}
