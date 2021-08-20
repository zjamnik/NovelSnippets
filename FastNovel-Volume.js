function download(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

async function getChapter(chapterUrl){
	let chapterDownload = await fetch(chapterUrl, {
		"headers": {
			"sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
			"sec-ch-ua-mobile": "?0",
			"upgrade-insecure-requests": "1"
		},
		"referrer": "https://fastnovel.net/nanomancer-reborn-ive-become-a-snow-girl2-156/",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": null,
		"method": "GET",
		"mode": "cors",
		"credentials": "omit"
	});

	if (chapterDownload.ok) {
		let response = await chapterDownload.text();
		document.open();
		document.write(response);
		document.close()

		let title = document.querySelector("h1.episode-name");
		let matched = title.textContent.match(/(Chapter.*)/g);
		title.innerHTML = matched[0];
		let content = document.querySelector("div#chapter-body");
		content.prepend(title);
		content.innerHTML = content.innerHTML.replaceAll("…","...").replace(/Find authorized novels.*for visiting/g, "").replace(/([A-z])\.([A-z])/g, function (match, p1, p2, offset, string){return p1+p2;}).replace(/([A-z])\.([A-z])/g, function (match, p1, p2, offset, string){return p1+p2;});

		return content.innerHTML;
	}
}


// Start file download.
//download("hello.txt","This is the content of my file :)");
async function main()
{
	let volumeLinks = ["", []]
	let volumes = document.querySelectorAll("div.book");
	let title = document.querySelector("h1.name").textContent;
	let author = document.querySelector("ul.meta-data>li a").textContent;

	for (volume = 0; volume < volumes.length; volume++) {
		let chapterLinks = [];
		let chapters = volumes[volume].querySelectorAll("ul a");

		for (chapter in chapters) {
			chapterLinks[chapters[chapter].text] = chapters[chapter].href;
		}

		volumeLinks[volume] = [volumes[volume].querySelectorAll("a")[0].text, chapterLinks];
	}

	for (volume in volumeLinks) {
		var volumeNumber = volumeLinks[volume][0].match(/^.* (\d+)/)[1];

		if(volumeNumber >= 10)    //0 for all
		{
			let toDownload = ""

			for (link in volumeLinks[volume][1])
			{
				if (volumeLinks[volume][1][link] != undefined)
				{
					//console.log(volumeLinks[volume][1][link])
					toDownload += await getChapter(volumeLinks[volume][1][link]);
				}
			}

			//download("Nanomancer Reborn - " + volumeLinks[volume][0] + ".html", toDownload)
			let volumeName = volumeLinks[volume][0].replaceAll(": "," ").replaceAll(":","").replaceAll(" - "," ").replace(/Volume (\d)\b/,"Volume 0$1");
			download(title + " - " + volumeName + " - " + author + ".html", toDownload)
		}
	}
}

main();