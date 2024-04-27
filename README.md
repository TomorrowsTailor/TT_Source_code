<h1>Tomorrow's Tailor</h1>
<p>
This project is done using MERN stack
</p>
<p>
Functionalities implemented:
1.Authentication and Authorization
2.calculating vector points on backend
3.logout functionality
4.generating vector images of trouser using customised values on frontend using svg(scalable vector graphics)
5.implemented basic admin panel
6.admin panel has an ability to edit formulas and delete fromulas of vector points of trouser.
7.used redux for state management in frontend part.
8.implemented protected routing (frontend and backend)
9.implemented pdf generating function in backend using pdfkit module.
10.implemented frontview generation function on a4 page of pdf using pdfkit module.
</p>
<p>Points to be noted the vector points are in cm so for vector image to get on pdf we need to convert them into pdfkit pdf (A4,A3) dimensions.</p>

<p>Functions to be implemented:
1.implement vector generation of front and back view of trouser using pdfkit module in backend and make divisions in such a way that they are to the actual dimensions when we download and print it.
2.implement admin panel (editing formulas and bring pairs to admin panel)
3.caching of vector points after they are calculated in backend when generating pdf (can use redis)
</p>
