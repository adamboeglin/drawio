/**
 * Google Drive plugin limits supported storage to Google Drive, browser and device.
 */

console.log("Loading Plugin");

Draw.loadPlugin(function(EditorUi)
{
	OneDrive = null;
	drive = null;
	gapi = null;
	EditorUi.gapi = null;

	window.OneDriveClient = null;
	window.DropboxClient = null;
	window.TrelloClient = null;
	window.DriveClient = null;

	EditorUi.oneDrive = null;
	EditorUi.dropbox = null;
	EditorUi.gitLab = null;
	EditorUi.gitHub = null;
	EditorUi.trello = null;
	EditorUi.drive = null;
	
	App.prototype.showBanner = function(){};
	Editor.prototype.appName = "Azure Diagrams";

	isLocalStorage = false;

	// Load Jquery and update the UI
	(function() {
		// Load the script
		var script = document.createElement("SCRIPT");
		script.src = 'https://code.jquery.com/jquery-1.7.1.min.js';
		script.type = 'text/javascript';
		script.onload = function() {
			var $ = window.jQuery;

			logoObject = $(".geMenubarContainer a").not(".geItem").filter('[style]');
			logoObject.css('background-image', 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmlld0JveD0iMCAwIDIzIDIzIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxMiIKICAgc29kaXBvZGk6ZG9jbmFtZT0ibWljcm9zb2Z0LWxvZ28uc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjQgKDVkYTY4OWMzMTMsIDIwMTktMDEtMTQpIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGExOCI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczE2IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTcxOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMzU2IgogICAgIGlkPSJuYW1lZHZpZXcxNCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iNDEuMDQzNDc4IgogICAgIGlua3NjYXBlOmN4PSIxMy44NDA1NTgiCiAgICAgaW5rc2NhcGU6Y3k9IjUuMDI2NTgxOSIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNDE0MSIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iNzA0IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMTIiIC8+CiAgPHBhdGgKICAgICBmaWxsPSIjZjM1MzI1IgogICAgIGQ9Ik0xIDFoMTB2MTBIMXoiCiAgICAgaWQ9InBhdGg0IiAvPgogIDxwYXRoCiAgICAgZmlsbD0iIzgxYmMwNiIKICAgICBkPSJNMTIgMWgxMHYxMEgxMnoiCiAgICAgaWQ9InBhdGg2IiAvPgogIDxwYXRoCiAgICAgZmlsbD0iIzA1YTZmMCIKICAgICBkPSJNMSAxMmgxMHYxMEgxeiIKICAgICBpZD0icGF0aDgiIC8+CiAgPHBhdGgKICAgICBmaWxsPSIjZmZiYTA4IgogICAgIGQ9Ik0xMiAxMmgxMHYxMEgxMnoiCiAgICAgaWQ9InBhdGgxMCIgLz4KPC9zdmc+Cg==)');
			logoObject.css('width', '45px');
			logoObject.css('height', '45px');
			logoObject.css('margin', '8px 0px 8px 10px');
			logoObject.css('backgroundColor', '#000000');
			logoObject.clone(false).appendTo(logoObject.parent());
			logoObject.remove();
			
			titleDiv = $(".geMenubarContainer").children("div").not(".geMenubar");
			titleDiv.css('left', '70px');
			titleDiv.prepend('<span style="color: white; font-size: 18px;">Azure Diagrams  <b data-icon-name="Separator" style="color: #0078d4; font-size: 20px" role="presentation">|</b></span>');
			console.log("Done loading Plugin");
		
			titleDiv.children("a").css('display','inline-block');

			$('link[rel="shortcut icon"]').attr('href','https://azure.microsoft.com/favicon.ico');

		};
		document.getElementsByTagName("head")[0].appendChild(script);
	})();

});
