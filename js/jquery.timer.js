<html lang="en" style="background: #F9F9F9;"><head>
<link href="css/style.css" rel="stylesheet">
<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="/js/timer.js"></script>    
<script type="text/javascript" src="/js/jquery.timer.js"></script>    
</head>
<body>    
 

<div style="align:center; margin:100px;">    
        <div class="timer">
            <span class="hour">00</span>:<span class="minute">00</span>:<span class="second">00</span>
        </div>
        <div class="control">
            <button onClick="timer.start(1000)">Start</button> 
            <button onClick="timer.stop()">Stop</button> 
            <button onClick="timer.reset(0)">Reset</button> 
            <button onClick="timer.mode(1)">Count up</button> 
            <button onClick="timer.mode(0)">Count down</button>
        </div>   
</div>   
</body>
</html>    