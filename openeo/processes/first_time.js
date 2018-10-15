const eeUtils = require('../eeUtils');

module.exports = {
	process_id: "first_time",
	description: "Returns the first element of a time series for all bands of the input dataset.",
	parameters: {
		imagery: {
			description: "EO data to process.",
			required: true,
			schema: {
				type: "object",
				format: "eodata"
			}
		}
	},
	returns: {
		description: "Processed EO data.",
		schema: {
			type: "object",
			format: "eodata"
		}
	},
	eeCode(args, req, res) {
		return eeUtils.toImageCollection(args.imagery).reduce(args.null === true ? 'first' : 'firstNonNull');
	}
};