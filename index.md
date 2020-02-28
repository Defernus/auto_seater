<html>
    <head>
        <title>wrokers  seating</title>
    </head>
    <body>
        <div>
            <p id="out">___</p>
            <input type="button" value="reseat" onclick="reseat()">
            <input type="button" value="reseatH" onclick="reseatH()">
            <input type="button" value="itterate" onclick="ittButton()">
            <input type="number" id="itt_times" value="1">
            <input type="button" id="abort_button" value="abort" onclick="abortItts()" style="display:none">
        </div>
        <div>
            <canvas id="canvas" width="1280" height="640"></canvas>
        </div>
        
        <script src="./utils.js"></script>
        <script src="./main.js"></script>
    </body>
</html>