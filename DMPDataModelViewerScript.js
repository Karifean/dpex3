$(document).ready(function() {
	$.get("https://drive.google.com/open?id=0B2I1A5C0icSHNE90ZldyNEljTjQ", function(xml) { start((new XMLSerializer()).serializeToString(xml)); });
});

function start(input) {
	var xmlDOM = $.parseXML(input);
	var $xml = $( xmlDOM ).children("dmp");
	var appended = "";
	appended += constructProjectData($xml.children("project"));
	appended += constructDocumentation($xml.children("documentation"));
	appended += constructDataTables($xml.children("files"));
	appended += constructMetaData($xml.children("metadata"));
	$( "#outputhalf" ).empty();
	$( "#outputhalf" ).append(appended);
}

function constructProjectData(root) {
	var appended = "<div class=\"project\">";

	var projectname = root.children( "project-name" );
	if (projectname.length != 1) {
		throw new Error("No single Project Name defined!");
	} else {
		appended += "<h1 class=\"projectname\">" + projectname.text() + "</h1>";
	}
	var institute = root.children( "institute" );
	if (institute.length > 0) {
		appended += "<p class=\"institute\"><b>Institute:</b> " + institute.text() + "</p>";
	}
	var researchers = root.children( "researchers" );
	if (researchers.length > 0) {
		appended += "<p class=\"researchers\"><b>Researchers:</b> ";
		var researcher = researchers.children( "researcher" );
		for (var i = 0; i < researcher.length; i++) {
			appended += researcher[i].textContent;
			if (i+1 < researcher.length) {
				appended += ", ";
			}
		}
	}
	return appended + "</div>\n";
}

function constructDocumentation(root) {
	var appended = "<div class=\"documentation\">";

	var section = root.children( "section" );
	if (section.length > 0) {
		appended += "<h2>Plan</h2>";
		var i = 0;
		section.each(function() { appended += constructSection($(this), i++); })
		/*for (var i = 0; i < section.length; i++) {
			appended += 
		}*/
	}

	return appended + "</div>\n";
}

function constructSection(root, i) {
	var sectionName = root[0].attributes.name.value;
	var appended = "<h4><a href=\"javascript:showHideSection(\'sec" + i + "\')\" class=\"sectiontitle\">" + sectionName + "</a></h4>\n<div class=\"section sec" + i + "\">";
	var question = root.children( "question" );

	question.each(function() {
		var qt = $(this).children( "question-text" ).text();
		appended += "<p class=\"question-text\"><i>" + qt + "</i></p>";
		var answer = $(this).children( "answer" );
		var at = answer.children( "answer-text" );
		if (at.length > 0) {
			appended += "<p class=\"answer-text\">" + at.text() + "</p>";
		}
		var af = answer.children( "answer-file" );
		if (af.length > 0) {
			appended += "<p class=\"answer-file\"><a href=\"" + af.text() + "\">Download File</a></p>";
		}
	})

	return appended + "</div>\n";
}

function showHideSection(section) {
	$("." + section).toggle();
}

function constructDataTables(root) {
	var appended = "<div class=\"datatables\"><h2>Files</h2>\n";
	var data = root.children( "data" );
	data.each(function() {
		appended += "<h4>" + $(this)[0].attributes.title.value;
		if ($(this)[0].attributes.type !== undefined) {
			appended += " (" + $(this)[0].attributes.type.value + ")";
		}
		appended += "</h4>\n"
		var format = $(this).children("format");
		if (format.length > 0) {
			appended += "<p class=\"data-format\"><i>Format: " + format.text() + "</i></p>";
		}
		var description = $(this).children("description");
		if (description.length > 0) {
			appended += "<p class=\"data-description\">" + description.text() + "</p>";
		} else {
			appended += "<p class=\"data-description\">No description available</p>";
		}
		var publication = $(this).children("publication");
		var url = publication.children("url");
		var license = publication.children("license");
		appended += "<p class=\"data-publication\">" +
					"<a class=\"data-publication-url\" href=\"" + url.text() + "\">Download Link</a><br/>" +
					"<a class=\"data-publication-license\" href=\"" + license.text() + "\">License</a></p>"
	})
	return appended + "</div>\n";
}

function constructMetaData(root) {
	var appended = "<div class=\"metadata\">";

	var release = root.children("release");
	var version = release.children("version");
	var date = release.children("date");
	appended += "<p class=\"version\">Version " + version.text() + ", " + date.text() + "</p>";
	appended += "<p class=\"authors\">Written by ";
	var authors = root.children("authors");
	var author = authors.children( "author" );
	for (var i = 0; i < author.length; i++) {
		appended += author[i].textContent;
		if (i+1 < author.length) {
			appended += ", ";
		}
	}
	appended += "</p>"
	var contact = root.children("contact");
	if (contact.length > 0) {
		appended += "Contact " + contact.text() + " for further information.";
	}

	return appended + "</div>\n";
}