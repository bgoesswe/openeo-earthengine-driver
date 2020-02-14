const Errors = require('../errors');
const { BaseProcess } = require('@openeo/js-processgraphs');

module.exports = class rename_dimension extends BaseProcess {

	async execute(node) {
		var dc = node.getData("data");
		var srcName = node.getArgument('source');
		var trgName = node.getArgument('target');

		if (dc.hasDimension(srcName)) {
			throw new Errors.ProcessArgumentInvalid({
				process: this.schema.id,
				argument: 'source',
				reason: 'A dimension with the specified name does not exist.'
			});
		}

		if (dc.hasDimension(trgName)) {
			throw new Errors.ProcessArgumentInvalid({
				process: this.schema.id,
				argument: 'target',
				reason: 'A dimension with the specified name already exists.'
			});
		}

		dc.renameDimension(srcName, trgName);
		return dc;
	}

};