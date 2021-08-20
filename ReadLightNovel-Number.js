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

		document.querySelectorAll("div.chapter-content3 div.desc div").forEach(function(elem) {elem.remove()});
        document.querySelectorAll("div.chapter-content3 div.desc script").forEach(function(elem) {elem.remove()});
        document.querySelectorAll("div.chapter-content3 div.desc center").forEach(function(elem) {elem.remove()});
		document.querySelectorAll("div.chapter-content3 div.desc small").forEach(function(elem) {elem.remove()});
		document.querySelectorAll("div.chapter-content3 div.desc br").forEach(function(elem) {elem.remove()});
		document.querySelectorAll("div.chapter-content3 div.desc hr").forEach(function(elem) {elem.remove()});
		let content = document.querySelector("div.chapter-content3 div.desc");
		console.log("[DEBUG] " + content);
		content.innerHTML = content.innerHTML.replaceAll("…","...").replace(/Find authorized novels.*for visiting/g, "").replace(/([A-z])\.([A-z])/g, "$1$2").replace(/([A-z])\.([A-z])/g, "$1$2");

		return content.innerHTML;
	}
}


// Start file download.
//download("hello.txt","This is the content of my file :)");

let volumeLinks = ["", []]
let chapters = document.querySelectorAll("div.chapters div.tab-content a");
let volumes = [[]];
let perVolume = 100;
let title = document.querySelector("div.block-title h1").textContent;
//let author = document.querySelector("body > div:nth-child(4) > div > div > div.col-lg-8.content > div > div:nth-child(2) > div > div.novel-left > div.novel-details > div:nth-child(5) > div.novel-detail-body > ul > li").textContent;
let author = "Feng Yise" // Unrivaled Medicine God

console.log(chapters.length / perVolume + 1);

for(vol = 0; vol < Math.ceil(chapters.length/perVolume); vol++)
{
    let chapterLinks = [];

    for(chap = 0; chap < perVolume && vol * perVolume + chap < chapters.length; chap++)
    {
        let chapIndex = vol * perVolume + chap;
        chapterLinks[chapters[chapIndex].text] = chapters[chapIndex].href;
    }

    volumeLinks[vol] = ["Volume " + (vol + 1), chapterLinks];
}

//console.log(volumeLinks);

for (volume in volumeLinks) {
	let volumeNumber = volumeLinks[volume][0].match(/Volume (\d+)/)[1];

	if(volumeNumber > 18)
	{
		let toDownload = ""

		for (link in volumeLinks[volume][1]) {
			//console.log(link)
			if (volumeLinks[volume][1][link] != undefined) {
				//console.log(volumeLinks[volume][1][link])
				toDownload += await getChapter(volumeLinks[volume][1][link]);
				//console.log("[DEBUG] " +toDownload);
			}
			//console.log(download)
		}

		let volumeName = volumeLinks[volume][0].replaceAll(": "," ").replaceAll(":","").replaceAll(" - "," ").replace(/Volume (\d)\b/,"Volume 0$1");
		download(title + " - " + volumeName + " - " + author + ".html", toDownload)
	}
}