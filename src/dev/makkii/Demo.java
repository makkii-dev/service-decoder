package dev.makkii;

import java.math.BigInteger;
import avm.Result;
import avm.Address;
import avm.Blockchain;
import org.aion.avm.userlib.abi.ABIDecoder;
import avm.Blockchain;

public final class Demo {

    private static long id = 0;

    private static final char[] HEX_ARRAY = "0123456789abcdef".toCharArray();

    private static String bytes_to_hex(byte[] input) {
        int length = input.length;
        char[] chars = new char[length * 2];
        for(int i = 0; i < length; ++i) {
            int v = input[i] & 255;
            chars[i * 2] = HEX_ARRAY[v >>> 4];
            chars[i * 2 + 1] = HEX_ARRAY[v & 15];
        }
        return new String(chars);
    }

    public static byte[] main() {

        BigInteger value = Blockchain.getValue();

        byte[] data = Blockchain.getData();
        ABIDecoder decoder = new ABIDecoder(data);
        
        Blockchain.println("!!! Demo/main value=" + value.toString());
        Blockchain.println("!!! Demo/main data=" + bytes_to_hex(data));
        String method = decoder.decodeMethodName();
        Blockchain.println("!!! Demo/main method=" + method);

        switch (method) {

            case "types":
                Blockchain.println("!!! Demo/main byte=" + decoder.decodeOneByte());
                Blockchain.println("!!! Demo/main boolean=" + decoder.decodeOneBoolean());
                Blockchain.println("!!! Demo/main char=" + decoder.decodeOneCharacter());
                Blockchain.println("!!! Demo/main short=" + decoder.decodeOneShort());
                Blockchain.println("!!! Demo/main int=" + decoder.decodeOneInteger());
                Blockchain.println("!!! Demo/main long=" + decoder.decodeOneLong());
                Blockchain.println("!!! Demo/main float=" + decoder.decodeOneFloat());
                Blockchain.println("!!! Demo/main double=" + decoder.decodeOneDouble());
                Blockchain.println("!!! Demo/main string=" + decoder.decodeOneString());
                Blockchain.println("!!! Demo/main address=" + decoder.decodeOneAddress());
                Blockchain.println("!!! Demo/main Address=" + decoder.decodeOneAddress());
                Blockchain.println("!!! Demo/main byte[]=" + decoder.decodeOneByteArray());
                Blockchain.println("!!! Demo/main boolean[]=" + decoder.decodeOneBooleanArray());
                Blockchain.println("!!! Demo/main char[]=" + decoder.decodeOneCharacterArray());
                Blockchain.println("!!! Demo/main short[]=" + decoder.decodeOneShortArray());
                Blockchain.println("!!! Demo/main int[]=" + decoder.decodeOneIntegerArray());
                Blockchain.println("!!! Demo/main long[]=" + decoder.decodeOneLongArray());
                Blockchain.println("!!! Demo/main float[]=" + decoder.decodeOneFloatArray());
                Blockchain.println("!!! Demo/main double[]=" + decoder.decodeOneDoubleArray());
                Blockchain.println("!!! Demo/main string[]=" + decoder.decodeOneStringArray());
                Blockchain.println("!!! Demo/main address[]=" + decoder.decodeOneAddressArray());
                Blockchain.println("!!! Demo/main biginteger=" + decoder.decodeOneBigInteger());
                Blockchain.println("!!! Demo/main biginteger[]=" + decoder.decodeOneBigIntegerArray());
                id = id + 1;
                break;

            default:
                break;
        }

        return new byte[0];
    }
}