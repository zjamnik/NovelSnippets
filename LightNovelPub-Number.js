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
	let chapterDownload = await fetch(chapterUrl);

	if (chapterDownload.ok) {
		let response = await chapterDownload.text();
		//document.open();
		//document.write(response);
		//document.close()
		document.getElementsByTagName("html")[0].innerHTML = response;
		
		await new Promise(r => setTimeout(r, 100));

		let title = document.createElement("h1");
		title.innerHTML = document.querySelector("div.titles h2").innerText;
		let content = document.querySelector("#chapter-container");
		content.prepend(title);
        content.querySelectorAll("#chapter-container div").forEach(function(e){e.remove();});
        content.querySelectorAll("#chapter-container p").forEach(function(e){if(e.classList.length > 0)e.remove();});
		content.innerHTML = content.innerHTML.replaceAll("…","...").replace(/([A-z])\.([A-z])/g, function (match, p1, p2, offset, string){return p1+p2;}).replace(/([A-z])\.([A-z])/g, function (match, p1, p2, offset, string){return p1+p2;});

		return content.innerHTML;
	}
}

function appendLog(log)
{

}

async function main()
{
	let startChapter = 951;
	let endChapter = 1100; // 0/false = until last
	let perVolume = 50;    // 0/false = all in one
	var debug = false;
	let volumeLinks = ["", []]
	let title = document.querySelector("h1.novel-title").innerText.replaceAll(" (WN)", "").replaceAll(" (LN)", "");
	let author = document.querySelector("div.author > a > span").innerText;

	endChapter = endChapter ? endChapter : document.querySelector("#chapters > div.intro > a").innerText.match(/\d+/)[0];
	perVolume = perVolume ? perVolume : Number.MAX_VALUE;

	if(debug) console.log(endChapter + " " + perVolume);

	for(vol = Math.ceil(startChapter/perVolume); vol <= Math.ceil(endChapter/perVolume); vol++)
	{
		let chapterLinks = [];

		for(chap = ((vol - 1) * perVolume) + ( vol == Math.ceil(startChapter/perVolume) ? startChapter % perVolume : 1); chap <= vol * perVolume && chap <= endChapter; chap++)
		{
			let chapIndex = vol * perVolume + chap;
			chapterLinks[chap] = window.location.href + "/chapter-"+chap;
			if(debug) console.log(chapterLinks[chap]);
		}

		volumeLinks[vol] = ["Volume " + (vol), chapterLinks];
	}

	if(debug) console.log(volumeLinks);
    
    var antiSpam = 1
	for(volume = Math.ceil(startChapter/perVolume); volume <= Math.ceil(endChapter/perVolume); volume++)
	{
		if(debug) console.log(volume);
		let toDownload = ""

		for(link = ((volume - 1) * perVolume) + 1; link <= volume * perVolume && link <= endChapter; link++)
		{
			if(debug) console.log(volumeLinks[volume][1][link]);
			if (volumeLinks[volume][1][link] != undefined) {
				if(!debug) toDownload += await getChapter(volumeLinks[volume][1][link]);
				if(antiSpam % 30 == 0)
				{
					console.log("antispam")
					await new Promise(r => setTimeout(r, 65000));
				}
				++antiSpam;
			}
		}

		let volumeName = volumeLinks[volume][0].replace(/Volume (\d)\b/,"Volume 0$1");
		if(!debug) download(title + " - " + volumeName + " - " + author + ".html", toDownload)
	}
}

main();