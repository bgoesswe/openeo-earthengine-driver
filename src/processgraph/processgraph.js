const { ProcessGraph } = require('@openeo/js-commons');
const GeeProcessGraphNode = require('./node');
const Errors = require('../errors');
const Utils = require('../utils');

module.exports = class GeeProcessGraph extends ProcessGraph {

	constructor(jsonProcessGraph, context) {
		super(jsonProcessGraph, context.server().processes());
		this.context = context;
		this.loadCollectionRect = null;
	}

	getContext() {
		return this.context;
	}

	createNodeInstance(json, id, parent) {
		// Optimization for web services to only load the extent of the data that is needed if no spatial extent is defined by the load_collection process
		if (this.loadCollectionRect && json.process_id === 'load_collection' && Utils.isObject(json.arguments) && !json.arguments.spatial_extent) {
			// ToDo: If an extent exists, use the intersecting area between tile and user-selected bounding box to further improve runtime.
			json.arguments.spatial_extent = this.loadCollectionRect;
		}
		return new GeeProcessGraphNode(json, id, parent);
	}

	createProcessGraphInstance(json) {
		return new GeeProcessGraph(json, this.context);
	}

	async validateNode(node) {
		var process = this.getProcess(node);
		return await process.validate(node, this.context);
	}

	async executeNode(node) {
		var process = this.getProcess(node);
		return await process.execute(node, this.context);
	}


	optimizeLoadCollectionRect(rect) {
		this.loadCollectionRect = rect;
	}

	addError(error) {
		this.errors.add(Errors.wrap(error));
	}

	// ToDo: Remove once we updated to js-commons v0.4.8, it's available there.
	getNodeCount() {
		return Utils.size(this.nodes);
	}

};