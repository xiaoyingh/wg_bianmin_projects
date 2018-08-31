/*
Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cksource.com/ckfinder/license
*/

CKFinder.customConfig = function( config )
{
	// Define changes to default configuration here.
	// For the list of available options, check:
	// http://docs.cksource.com/ckfinder_2.x_api/symbols/CKFinder.config.html

	// Sample configuration options:
	// config.uiColor = '#BDE31E';
	// config.language = 'zh-cn';
	// config.removePlugins = 'basket';
};


function BrowseServer( startupPath, functionData )
{
	var finder = new CKFinder();
	finder.basePath = './';
	finder.startupPath = startupPath;
	finder.selectActionFunction = SetFileField;
	finder.selectActionData = functionData;
	finder.popup();
}
function SetFileField( fileUrl, data )
{
	document.getElementById( data["selectActionData"] ).src = fileUrl;
}