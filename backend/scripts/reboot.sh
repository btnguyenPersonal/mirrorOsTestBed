#!/usr/bin/expect -f
set IPAddress "192.168.1.140"
set Username "ostestbed"
set Password "05testbed!"
set PortNo [lindex $argv 0];

set timeout 10

spawn ssh -o KexAlgorithms=+diffie-hellman-group1-sha1 -o HostKeyAlgorithms=ssh-dss $Username@$IPAddress
expect "*: "
send "$Password\r"
expect "#" {send "configure terminal\r"}
expect "(config)#" {send "interface GE$PortNo\r"}
expect "(config-if)#" {send "power inline never\r"}
expect "(config-if)#" {send "power inline auto\r"}
expect "(config-if)#" {send "exit\r"}
expect "(config)#" {send "exit\r"}
expect "#" {send "exit\r"}
interact