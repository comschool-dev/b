<?php
$xml = simplexml_load_file('xml-products.xml');

$array = get_object_vars($xml);
$properties = array_keys($array);
 
//var_dump ($array);
print_r($xml);