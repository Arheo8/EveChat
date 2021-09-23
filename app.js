<section>
    <div class="container">
        <div class="user">
            <div class="container m-0 p-0 mecl">
                <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4 justify-content-between">
                    <h2 style="color: white;">EveChat</h2>
                    <p id="user_name" style="visibility: hidden;">
                        <%= user.name %>
                    </p>
                    <a class="btn btn-outline-warning my-2 my-sm-0" href="/users/logout">Logout</a>
                </nav>
                <ul class="messages"></ul>
                <div class="msg-inp">
                    <form action="/dashboard" method="POST" id="chatForm">
                        <input class="txt" autocomplete="off" autofocus="on" placeholder="type your message here..." /><button>Send</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
</section>
<script src="../../socket.io/socket.io.js"></script>
<script src="https://code.jquery.com/jquery-1.10.1.min.js"></script>
<script>
    var socket = io.connect('http://localhost:5000');


    $('form').submit(function(e) {
        e.preventDefault();
        socket.emit('chat_message', $('.txt').val());
        $('.txt').val('');
        return false;
    });

    socket.on('chat_message', function(msg) {
        $('.messages').append($('<li>').html(msg));
    });

    socket.on('is_online', function(username) {
        $('.messages').append($('<li>').html(username));
    });
    var User = document.getElementById("user_name").innerHTML
    socket.emit('username', User);
</script>
