<h1><strong>SURVEY API</strong></h1>
<p><strong>Simple API to enable creating surveys and voting for the one or more survey</strong></p>
<p><strong>Libraries Used</strong><br />Express : web application framework<br />Morgan : logging<br />Cors:cors<br />lowDb: persisting data to disk in JSON format<br />SwaggerUI &amp; SwaggerJsDoc: for documentation<br />Fs &amp; path : persisting logs to file<br />Docker: containerization<br />jest &amp; supertest for unit and integration testing</p>
<p><strong>How to Setup</strong></p>
<ol>
<li>The command bellow will pull the images from docker hub and execute locally. Subsequently running the command will execute from locally downloaded docker image. This assumes that port 9000 is currently free on your local system. Else change to another available port<br />
<div>
<div><em>docker run -it -p 9000:3000 9096543/survey-api</em></div>
</div>
</li>
<li>On successful start, you will see the message&nbsp;<em><code>Backend is running on http://localhost:9000</code></em></li>
<li>Swagger integrated to make testing and documentation easy. To access the swagger end point go to<br /><em><a href="http://localhost:9000/api-docs/" rel="nofollow">http://localhost:9000/api-docs/</a></em></li>
<li>The easiest way to test this endpoint is via the swagger endpoint above. However, for clarity, The following end point are exposed
<ol>
<li>Retrieve all survey <em>GET&nbsp;<a href="http://localhost:9000/api/v1/surveys" rel="nofollow">http://localhost:9000/api/v1/surveys</a></em></li>
<li>Retrieve specific survey by passing an ID GET&nbsp;<a href="http://localhost:9000/api/v1/surveys" rel="nofollow">http://localhost:9000/api/v1/surveys</a>/1</li>
<li>Create a survey POST <em><a href="http://localhost:3000/api/v1/surveys" rel="nofollow">http://localhost:9000/api/v1/surveys</a></em><br />and pass survey question to the body as JSON. Fo example<br /><em>{ "survey_question": "Are you a male?" }</em></li>
<li>You can vote for multiple surveys using <em>PUT <a href="http://localhost:3000/api/v1/surveys" rel="nofollow">http://localhost:9000/api/v1/surveys</a></em>&nbsp; . Pass a JSON to the body. For example<br /><em>[{ "id":1, "vote":"true" },{ "id":2, "vote":"false" }, { "id":3, "vote":"false" } ]</em></li>
<li>You can vote for one survey question at a time using <em>PUT <a href="http://localhost:9000/api/v1/surveys/1">http://localhost:9000/api/v1/surveys/1</a></em><em>&nbsp; and pass the vote to the body as JSON. e.g&nbsp; {"vote":false}</em></li>
<li>You can delete a survey using<em> DELETE</em><em>&nbsp;<a href="http://localhost:9000/api/v1/surveys/1">http://localhost:9000/api/v1/surveys/1</a></em><em>&nbsp;</em></li>
</ol>
</li>
<li>For all the endpoint, the response are consistent in the format { status:string, message:string, data:array_of_object} e.g&nbsp; &nbsp;<em>{</em><br /><em>"status": "success",</em><br /><em>"message": "success",</em><br /><em>"data": [</em><br /><em>{</em><br /><em>"id": 1,</em><br /><em>"question": "Are you an adult?",</em><br /><em>"response": {</em><br /><em>"yes": 2,</em><br /><em>"no": 2</em><br /><em>}</em><em>},</em><br /><em>{</em><br /><em>"id": 2,</em><br /><em>"question": "Are you a Female?",</em><br /><em>"response": {</em><br /><em>"yes": 0,</em><br /><em>"no": 1</em><br /><em>}</em><em>}</em><em>]</em><em>}</em></li>
</ol>
