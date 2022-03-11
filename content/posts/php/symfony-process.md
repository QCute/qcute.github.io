---
title: "Symfony Process组件交互式进程问题"
date: 2020-03-09T00:00:00+08:00
categories: ["php"]
---

[Symfony](https://symfony.com/) [Process](https://symfony.com/doc/current/components/process.html)组件使用[SSH](http://www.openssh.com/)交互的问题  

打开[PTY](https://symfony.com/doc/current/components/process.html#using-tty-and-pty-modes)模式即可  
```php
$env = ['PATH' => getenv('PATH'), 'SSH_AUTH_SOCK' => getenv('SSH_AUTH_SOCK')]
$process = new Process(['ssh', 'username@host', 'echo 1'], null, $env);
// turning on PTY support
$process->setPty(true);
$process->run();
echo $process->getOutput();
```

参考  
> [Controlling an interactive process](https://github.com/symfony/symfony/issues/12518)
