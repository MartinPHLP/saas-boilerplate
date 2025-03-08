import multiprocessing


workers = multiprocessing.cpu_count() * 2 + 1

worker_class = 'gevent'
threads = 4
worker_connections = 1000

bind = "0.0.0.0:8000"

timeout = 900
keepalive = 2

max_requests = 1000
max_requests_jitter = 50
graceful_timeout = 30
limit_request_line = 4096
limit_request_fields = 100

# accesslog = '/var/log/gunicorn/access.log'
# errorlog = '/var/log/gunicorn/error.log'
# loglevel = 'info'

accesslog = "-"
errorlog = "-"
loglevel = 'debug'


forwarded_allow_ips = '*'
proxy_protocol = True
proxy_allow_ips = '*'

wsgi_app = 'core.wsgi:application'
