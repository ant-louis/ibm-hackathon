<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8"/>
		<title>Talent Finder</title>
		<link rel="stylesheet" href="design_TF.css"/>
	</head>

	<body>

		<div id = "main_wrapper">

			<header>
				<a href = "index.php" class = "talentfinder"><h1>Talent Finder</h1></a>
			</header>

			<section>

				<form method = "post" action = "index.php">

					<div class = "sites">
						<div class = "box"><label for = "spotify"><div class = "spotify_img"></div><p>Spotify</p></label><input type = "checkbox" name = "spotify" id = "spotify" checked /></div>
						<div class = "box"><label for = "youtube"><div class = "youtube_img"></div><p>YouTube</p></label><input type = "checkbox" name = "youtube" id = "youtube" /></div>
						<div class = "box"><label for = "soundcloud"><div class = "soundcloud_img"></div><p>SoundCloud</p></label><input type = "checkbox" name = "soundcloud" id = "soundcloud" /></div>
						<div class = "box"><label for = "facebook"><div class = "facebook_img"></div><p>Facebook</p></label><input type = "checkbox" name = "facebook" id = "facebook" /></div>
					</div>

					<div><input type = "submit" value = "Search" class = "button" /></div>

				</form>

				<table>

					<tr class = "fields">
						<th>Artist Name</th>
						<th>Country</th>
						<th>Potential</th>
					</tr>

					<tr>
						<td>Damso</td>
						<td>Belgium</td>
						<td>100%</td>
					</tr>

				</table>

			</section>

		</div>

	</body>

</html>