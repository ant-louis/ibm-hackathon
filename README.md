# IBM-Hackathon

On 23 and 24 November 2018, a coding hackathon was organized in the headquarter of IBM Brussels. Each team has to solve a real life problem of an IBM client by making use of IBM Cloud services. IT-professors of Belgian universities and university colleges were invited to send teams of 4 students with programming experience. The objective wass to get teams of different university colleges and different faculties departments of universities.

## The SABAM case - What’s the next big thing?

Sabam is always on the lookout for emerging talent. Emerging bands are not always aware of their rights and the money they can rightfully earn for public performances. As part of Sabam’s mission we want to reach out to these bands and inform them about authorsrights, their rights, the in- and outs of publishing deals and the general “what’s in it for you”. Authors that are still under radar of the mainstream press but are about to boom are our main target.

Our mission : What Belgian, French or Dutch musical authors/bands are booming under the radar? What’s the chatter about, where’s the buzz? What’s the next big thing?


## The problem

Every day, the account manager of SABAM looks for new talents to affiliate in Belgium, France and Netherlands. To do so, he uses several online platforms like Spotify, YouTube or Facebook to spot them. The problem is that this task is quite time-consuming, it's not a funny thing to do and finally, when we talk about a new artist on a social media, it's often already too late, he has probably been contacted by another company.

So concretely, what does SABAM wants ? It wants to detect new potential talents before anyone else does.

## Our solution

Our solution consists in using some machine learning algorithms that would use the exact same plateforms that the SABAM employee uses daily, and through these platforms, look for some signs about new songs that could possibly be a buzz. Given a new release, if we can predict that it's gonna be a hit, then the emerging artist is probably a new talent that SABAM wants to affiliate.

For a question of time in this hackathon, we decided to focus on Spotify. Why Spotify ? Because it has a great Web API that allows us to get extremely precise data about a song such as its tempo, its energy, its accousticness or its danceability. Concretely, our idea with Spotify is to analyze these features for a huge amount of songs of all genres and find a correlation between the characteristics of a song and its popularity.

How do we define the popularity of a song ? Well, the Spotify Web API also provides a "popularity" feature for all its songs, giving a value between 0 and 100 (100 being the maximal level of popularity of a song). This feature is a function of the number of clicks on the song in Spotify, but it also decreases over time such that a buzz from two years ago has a lower popularity value than a buzz from last week.


### First step - Collecting data

In order for our machine learning algorithm to train at best, we want a lot of tracks of all possible genres. Does the language matter ? Even if SABAM only looks for new talents from Benelux and France, where the majority of the songs are written in French, having non French songs





