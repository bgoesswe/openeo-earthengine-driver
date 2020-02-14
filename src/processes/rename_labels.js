const Errors = require('../errors');
const { BaseProcess } = require('@openeo/js-processgraphs');
const Commons = require('../processgraph/commons');

module.exports = class rename_dimension extends BaseProcess {


	renameLabels = function(src, trg){
		return function renameLabelsInner(image) {
			return image.select(src).rename(trg);
		};
	};

	async execute(node) {
		var dc = node.getData("data");
		var dimension = node.getArgument('dimension');
		var trgLabels = node.getArgument('target');
		var srcLabels = node.getArgument('source');

		if (!Array.isArray(trgLabels)){
			throw new Errors.LabelMismatch({
				process: this.schema.id,
				argument: 'source',
				reason: 'The number of labels in the parameters `source` and `target` don\'t match.'
			});
		}

		if (!Array.isArray(srcLabels)){
			srcLabels = new Array(trgLabels.length);
			for(var i = 0; i < srcLabels.length; i++) {
				srcLabels[i] = i;
			}
		}

		if (srcLabels.length !== trgLabels.length){
			throw new Errors.LabelMismatch({
				process: this.schema.id,
				argument: 'source',
				reason: 'The number of labels in the parameters `source` and `target` don\'t match.'
			});
		}
		// TODO: 1.0 Validate and provide defined Error messages
		// TODO: ATM works only for bands
		/*if (dc.hasDimension(dimension)) {
			throw new Errors.ProcessArgumentInvalid({
				process: this.schema.id,
				argument: 'source',
				reason: 'A dimension with the specified name does not exist.'
			});
		}*/

		//return Commons.applyInCallback(node, image => this.renameLabels(srcLabels, trgLabels));
		// TODO: change this to applyInCallback somehow?
		dc.imageCollection(data => data.map(this.renameLabels(srcLabels, trgLabels)));


		return dc;
	}

};