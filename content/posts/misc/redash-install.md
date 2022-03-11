---
title: "redash安装报错问题修复"
date: 2020-03-07T00:00:00+08:00
categories: ["misc"]
---

## 执行官方安装脚本[Setup](https://github.com/getredash/setup/), 出现以下报错

```sh
Traceback (most recent call last):
  File "/app/manage.py", line 9, in <module>
    manager()
  File "/usr/local/lib/python2.7/site-packages/click/core.py", line 716, in __call__
    return self.main(*args, **kwargs)
  File "/usr/local/lib/python2.7/site-packages/flask/cli.py", line 380, in main
    return AppGroup.main(self, *args, **kwargs)
  File "/usr/local/lib/python2.7/site-packages/click/core.py", line 696, in main
    rv = self.invoke(ctx)
  File "/usr/local/lib/python2.7/site-packages/click/core.py", line 1060, in invoke
    return _process_result(sub_ctx.command.invoke(sub_ctx))
  File "/usr/local/lib/python2.7/site-packages/click/core.py", line 1060, in invoke
    return _process_result(sub_ctx.command.invoke(sub_ctx))
  File "/usr/local/lib/python2.7/site-packages/click/core.py", line 889, in invoke
    return ctx.invoke(self.callback, **ctx.params)
  File "/usr/local/lib/python2.7/site-packages/click/core.py", line 534, in invoke
    return callback(*args, **kwargs)
  File "/usr/local/lib/python2.7/site-packages/click/decorators.py", line 17, in new_func
    return f(get_current_context(), *args, **kwargs)
  File "/usr/local/lib/python2.7/site-packages/flask/cli.py", line 257, in decorator
    return __ctx.invoke(f, *args, **kwargs)
  File "/usr/local/lib/python2.7/site-packages/click/core.py", line 534, in invoke
    return callback(*args, **kwargs)
  File "/app/redash/cli/database.py", line 31, in create_tables
    db.create_all()
  File "/usr/local/lib/python2.7/site-packages/flask_sqlalchemy/__init__.py", line 963, in create_all
    self._execute_for_all_tables(app, bind, 'create_all')
  File "/usr/local/lib/python2.7/site-packages/flask_sqlalchemy/__init__.py", line 955, in _execute_for_all_tables
    op(bind=self.get_engine(app, bind), **extra)
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/sql/schema.py", line 4005, in create_all
    tables=tables)
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/engine/base.py", line 1939, in _run_visitor
    with self._optional_conn_ctx_manager(connection) as conn:
  File "/usr/local/lib/python2.7/contextlib.py", line 17, in __enter__
    return self.gen.next()
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/engine/base.py", line 1932, in _optional_conn_ctx_manager
    with self.contextual_connect() as conn:
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/engine/base.py", line 2123, in contextual_connect
    self._wrap_pool_connect(self.pool.connect, None),
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/engine/base.py", line 2162, in _wrap_pool_connect
    e, dialect, self)
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/engine/base.py", line 1476, in _handle_dbapi_exception_noconnection
    exc_info
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/util/compat.py", line 265, in raise_from_cause
    reraise(type(exception), exception, tb=exc_tb, cause=cause)
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/engine/base.py", line 2158, in _wrap_pool_connect
    return fn()
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/pool.py", line 400, in connect
    return _ConnectionFairy._checkout(self)
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/pool.py", line 788, in _checkout
    fairy = _ConnectionRecord.checkout(pool)
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/pool.py", line 529, in checkout
    rec = pool._do_get()
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/pool.py", line 1193, in _do_get
    self._dec_overflow()
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/util/langhelpers.py", line 66, in __exit__
    compat.reraise(exc_type, exc_value, exc_tb)
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/pool.py", line 1190, in _do_get
    return self._create_connection()
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/pool.py", line 347, in _create_connection
    return _ConnectionRecord(self)
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/pool.py", line 474, in __init__
    self.__connect(first_connect_check=True)
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/pool.py", line 671, in __connect
    connection = pool._invoke_creator(self)
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/engine/strategies.py", line 106, in connect
    return dialect.connect(*cargs, **cparams)
  File "/usr/local/lib/python2.7/site-packages/sqlalchemy/engine/default.py", line 412, in connect
    return self.dbapi.connect(*cargs, **cparams)
  File "/usr/local/lib/python2.7/site-packages/psycopg2/__init__.py", line 130, in connect
    conn = _connect(dsn, connection_factory=connection_factory, **kwasync)
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) FATAL:  password authentication failed for user "postgres"
 (Background on this error at: http://sqlalche.me/e/e3q8)
```

## 解决办法, 修改[Postgres](https://www.postgresql.org/)数据库密码
进入[docker](https://www.docker.com/) shell
```sh
docker exec -it redash_postgres_1 /bin/bash
```

切换用户
```
su postgres
```

进入[postgres](https://hub.docker.com/_/postgres) shell
```sh
psql
```

修改密码
```sql
ALTER ROLE postgres WITH PASSWORD '你的env密码';
```

然后继续执行剩下命令即可
```sh
docker-compose run --rm server create_db
docker-compose up -d
```
